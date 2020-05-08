package psi.hnqis.imci.service;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class FeedbackServlet  extends HttpServlet {

    /**
     * 
     */
    private static final long serialVersionUID = -200435865468907866L;

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        request.getRequestDispatcher( "/index.html" ).forward(request, response);
    }

}
